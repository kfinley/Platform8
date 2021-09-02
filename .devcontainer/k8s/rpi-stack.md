# Setup Kubernetes (MicroK8s) on Raspberry Pi 4 Cluster

These steps were done on a stack of 3 Raspberry Pi 4s (Model B 8GB RAM).

1. Install latest Ubuntu Server using Raspberry Pi Imager
2. Startup each node and update hostname, mDNS (avahi-daemon), & set static IP.
3. Setup SSH keys to connect remotely
4. Setup NFS-Server using USB drive

  #### NFS-Server

  mkdir /media/expansion1
  mkdir /export/nfs

  sudo lsblk to get device id/name

  update /etc/fstab with
  /dev/sda1			/media/expansion1	vfat	dmask=000,fmask=0111,user	0	0
  /media/expansion1		/export/nfs		none	bind,rw		0	0

  Create workbench folder... (todo: change this...)

  update /etc/exports with:
  /export		192.168.0.0/24(insecure,no_subtree_check,rw,nohide,fsid=0)
  /export/nfs	192.168.0.0/24(insecure,no_subtree_check,rw,nohide)

  #### NFS-Clients

  Install nfs-common
  create /mnt/workbench

  update /etc/default/nfs-common
  NEED_GSSD=no

  NEED_IDMAPD=yes
  NEED_STATD=no

  update /etc/fstab with
  192.168.0.6:/export/nfs/workbench	/mnt/workbench	nfs4	bg		0	0

4. Install Microk8s on pi 0

  update /boot/firmware/cmdline.txt with:
  cgroup_enable=memory cgroup_memory=1

  sudo snap install microk8s --classic --stable

  user perms:
  sudo usermod -a -G microk8s ubuntu
  sudo chown -f -R ubuntu ~/.kube

  install add-ons:
  microk8s.enable helm3 storage dns registry

